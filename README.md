# Dictaphone Journal

Dictaphone Journal is a voice-first journaling app that helps people build stronger speaking, communication, and interview skills. Instead of only storing recordings, it turns each journal entry into a transcript, useful speaking metrics, and—in later versions—actionable AI feedback.

## Why it exists

People often want to practise speaking consistently, express ideas more clearly, and prepare for interviews, but standard recording apps do not show whether they are improving. Dictaphone Journal makes daily voice practice easy to keep and measurable over time.

## Who it is for

- Students and English learners
- Software engineers and job seekers
- Professionals preparing for interviews
- Public speakers and content creators

## MVP (Version 1)

The first release focuses on a dependable voice-journaling workflow:

1. Record a voice journal in the app.
2. Save the audio recording and its metadata.
3. Automatically create a transcript.
4. Let the user review and edit the transcript.
5. Organize entries by date.
6. Browse entries through a list and calendar view.
7. Search entries, add tags/categories, mark favourites, and edit or delete entries.
8. Show a simple dashboard: daily streak, total journals, total speaking time, and weekly activity.

## Future roadmap

### AI feedback (Version 2)

- Grammar correction and sentence rewrites
- Vocabulary suggestions
- Pronunciation and fluency feedback
- Confidence and readability scores
- AI-generated title, summary, insights, and action items

### Speaking analytics

- Words per minute and speaking duration
- Pause, filler-word, and repeated-word detection
- Grammar accuracy, vocabulary richness, and sentence complexity
- Fluency and confidence trends with weekly/monthly progress views

### Interview practice

- HR and technical interview prompts
- Practice explaining projects, algorithms, DSA problems, and system design
- Feedback for clarity, communication, confidence, grammar, structure, and overall interview performance

## Recommended first milestone

Build one complete vertical slice before dashboards, search, calendar, or AI scoring:

**Record audio → save an entry → transcribe it → display and edit the transcript → reopen the saved entry.**

This validates the app's core value and establishes the main data model, audio storage, transcription integration, and entry screen that every later feature depends on. Once it is reliable, add the entry list and dashboard, then layer on the advanced AI analysis and interview mode.

## Product principles

- Voice-first and quick enough for a daily habit
- User recordings and journals are private by default
- Feedback should be constructive, specific, and easy to act on
- Start simple; advanced AI features must enhance—not obstruct—the journaling flow
