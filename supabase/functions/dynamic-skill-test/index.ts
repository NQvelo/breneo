import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, sessionId, answer, questionNumber } = await req.json();
    
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) throw new Error('No authorization header');
    
    const supabaseClient = createClient(
      'https://kwvpfetgerukuglqeuzl.supabase.co',
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt3dnBmZXRnZXJ1a3VnbHFldXpsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAyNDYzNjEsImV4cCI6MjA2NTgyMjM2MX0.oQNRxz5hNqp_YVkIJ0KOtVSgAksQ0km6iESqiWI8wHw',
      { auth: { persistSession: false } }
    );

    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(authHeader.replace('Bearer ', ''));
    if (authError || !user) {
      console.error('Authentication error:', authError);
      throw new Error('User not authenticated');
    }

    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
    if (!OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY is not set');
    }

    if (action === 'start') {
      // Start a new test session
      const firstQuestion = "To get started, what's your current role or the type of work you're interested in? Please describe your background and what skills you'd like to develop.";
      
      const { data: testSession, error } = await supabaseClient
        .from('dynamic_skill_tests')
        .insert({
          user_id: user.id,
          session_data: {
            questions: [firstQuestion],
            answers: [],
            current_question: 1,
            status: 'active'
          }
        })
        .select()
        .single();

      if (error) throw error;

      return new Response(JSON.stringify({
        sessionId: testSession.id,
        question: firstQuestion,
        questionNumber: 1
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (action === 'next') {
      // Get current session
      const { data: session, error: sessionError } = await supabaseClient
        .from('dynamic_skill_tests')
        .select('*')
        .eq('id', sessionId)
        .eq('user_id', user.id)
        .single();

      if (sessionError) throw sessionError;

      const sessionData = session.session_data;
      const questions = sessionData.questions || [];
      const answers = sessionData.answers || [];

      // Add the new answer
      answers.push(answer);

      if (questionNumber >= 5) {
        // Generate final summary
        const conversationHistory = questions.map((q, i) => 
          `Q${i + 1}: ${q}\nA${i + 1}: ${answers[i] || ''}`
        ).join('\n\n');

        const summaryPrompt = `Based on this skill assessment conversation, provide a comprehensive analysis of the user's strengths and suggested career paths. Format your response as JSON with this structure:
{
  "strengths": ["strength1", "strength2", "strength3"],
  "suggested_careers": ["career1", "career2", "career3"],
  "skill_gaps": ["gap1", "gap2"],
  "learning_recommendations": ["recommendation1", "recommendation2"],
  "summary": "A detailed paragraph summarizing the assessment"
}

Conversation:
${conversationHistory}`;

        const summaryResponse = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${OPENAI_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'gpt-4',
            messages: [
              { role: 'system', content: 'You are a career assessment expert. Provide thoughtful, specific analysis based on the user responses.' },
              { role: 'user', content: summaryPrompt }
            ],
            temperature: 0.7,
          }),
        });

        const summaryData = await summaryResponse.json();
        const finalSummary = summaryData.choices[0].message.content;

        // Update session with completion
        await supabaseClient
          .from('dynamic_skill_tests')
          .update({
            session_data: {
              ...sessionData,
              answers,
              status: 'completed'
            },
            final_summary: finalSummary,
            completed_at: new Date().toISOString()
          })
          .eq('id', sessionId);

        return new Response(JSON.stringify({
          completed: true,
          summary: finalSummary
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // Generate next question based on conversation
      const conversationHistory = questions.map((q, i) => 
        `Q${i + 1}: ${q}\nA${i + 1}: ${answers[i] || ''}`
      ).join('\n\n');

      const nextQuestionPrompt = `You are conducting a dynamic skill assessment. Based on the conversation below, generate the next question (question ${questionNumber + 1} of 5) that will help assess the user's skills and career potential. 

Make the question:
- Specific and actionable
- Related to their previous answers
- Designed to reveal skills, experience, or potential
- Progressive (build on previous questions)

Return only the question text, no additional formatting.

Previous conversation:
${conversationHistory}`;

      const questionResponse = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages: [
            { role: 'system', content: 'You are a career assessment expert creating personalized questions.' },
            { role: 'user', content: nextQuestionPrompt }
          ],
          temperature: 0.8,
        }),
      });

      const questionData = await questionResponse.json();
      const nextQuestion = questionData.choices[0].message.content.trim();

      // Update session with new question and answer
      questions.push(nextQuestion);
      
      await supabaseClient
        .from('dynamic_skill_tests')
        .update({
          session_data: {
            ...sessionData,
            questions,
            answers,
            current_question: questionNumber + 1
          }
        })
        .eq('id', sessionId);

      return new Response(JSON.stringify({
        question: nextQuestion,
        questionNumber: questionNumber + 1
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    throw new Error('Invalid action');

  } catch (error) {
    console.error('Error in dynamic-skill-test function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});