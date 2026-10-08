// 담당: B — Day 2
// Supabase 클라이언트. 키는 .env.local 에 넣고 절대 커밋하지 않습니다 (.env.example 참고).
import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = url && anonKey ? createClient(url, anonKey) : null
