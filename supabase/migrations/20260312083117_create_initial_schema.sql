/*
  # Create Initial Schema for Israeli Teenagers Military Service App

  1. New Tables
    - `users`
      - `id` (uuid, primary key)
      - `name` (text, optional user name)
      - `age` (integer, user's age)
      - `recruitment_stage` (text, stage in recruitment process)
      - `main_concern` (text, what concerns them most)
      - `created_at` (timestamptz, when user signed up)
    
    - `task_responses`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to users)
      - `task_key` (text, identifier for the task)
      - `response_text` (text, user's answer)
      - `created_at` (timestamptz, when response was submitted)
    
    - `feedback`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to users)
      - `most_useful` (text, what was most useful)
      - `less_clear` (text, what was less clear)
      - `made_think` (boolean, whether app made them think)
      - `would_recommend` (boolean, whether they'd recommend)
      - `contact_info` (text, optional phone number)
      - `created_at` (timestamptz, when feedback was submitted)

  2. Security
    - Enable RLS on all tables
    - Add policies for users to access their own data
*/

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text DEFAULT '',
  age integer,
  recruitment_stage text,
  main_concern text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own data"
  ON users FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own data"
  ON users FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own data"
  ON users FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Create task_responses table
CREATE TABLE IF NOT EXISTS task_responses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  task_key text NOT NULL,
  response_text text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE task_responses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own responses"
  ON task_responses FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own responses"
  ON task_responses FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Create feedback table
CREATE TABLE IF NOT EXISTS feedback (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  most_useful text,
  less_clear text,
  made_think boolean,
  would_recommend boolean,
  contact_info text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own feedback"
  ON feedback FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own feedback"
  ON feedback FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);