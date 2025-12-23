
import { createClient } from '@/lib/supabase/client'

// Since this is a one-off fix, we can use the main client logic if env vars are present, or a script. 
// For better reliability with env vars, I'll use the same pattern as before.

import fs from 'fs';
import path from 'path';

// 1. Manually parse .env.local
const envPath = path.resolve(process.cwd(), '.env.local');
const envContent = fs.readFileSync(envPath, 'utf-8');
const envVars: Record<string, string> = {};

envContent.split('\n').forEach(line => {
    const parts = line.split('=');
    if (parts.length >= 2) {
        const key = parts[0].trim();
        const val = parts.slice(1).join('=').trim();
        envVars[key] = val;
    }
});

const url = envVars['NEXT_PUBLIC_SUPABASE_URL'];
const key = envVars['SUPABASE_SERVICE_ROLE_KEY'];

import { createClient as createSupabaseClient } from '@supabase/supabase-js';

const supabase = createSupabaseClient(url!, key!);

async function fixPaths() {
    console.log('Fixing image paths...');

    const { data: profiles } = await supabase.from('profiles').select('id, avatar_url');

    if (!profiles) return;

    for (const p of profiles) {
        if (p.avatar_url && !p.avatar_url.startsWith('/') && !p.avatar_url.startsWith('http')) {
            // It's a relative path without leading slash, e.g. "students/MS25W048.png"
            // We need "/students/MS25W048.png"
            const newPath = `/${p.avatar_url}`;
            console.log(`Fixing ${p.avatar_url} -> ${newPath}`);
            await supabase.from('profiles').update({ avatar_url: newPath }).eq('id', p.id);
        }
    }
    console.log('Done.');
}
fixPaths();
