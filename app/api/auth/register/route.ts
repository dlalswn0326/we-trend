import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { email, password, name, anonymousUserId } = body;

        if (!email || !password) {
            return NextResponse.json(
                { error: 'Email and password required' },
                { status: 400 }
            );
        }

        const bcrypt = require('bcrypt');

        // Check if email already exists
        const { data: existingUsers, error: findError } = await supabase
            .from('User')
            .select('id, isAnonymous')
            .eq('email', email)
            .limit(1);

        if (existingUsers && existingUsers.length > 0 && !existingUsers[0].isAnonymous) {
            return NextResponse.json(
                { error: 'Email already registered' },
                { status: 400 }
            );
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        let user;

        if (anonymousUserId) {
            // Convert anonymous user to registered user
            const { data: updatedUser, error: updateError } = await supabase
                .from('User')
                .update({
                    email,
                    password: hashedPassword,
                    name: name || undefined,
                    isAnonymous: false,
                })
                .eq('id', anonymousUserId)
                .select()
                .single();

            if (updateError) throw updateError;
            user = updatedUser;
        } else {
            // Create new registered user
            const { data: newUser, error: insertError } = await supabase
                .from('User')
                .insert({
                    id: crypto.randomUUID(),
                    email,
                    password: hashedPassword,
                    name: name || email.split('@')[0],
                    isAnonymous: false,
                    profileImage: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
                })
                .select()
                .single();

            if (insertError) throw insertError;
            user = newUser;
        }

        // Return user without password
        const { password: _, ...userWithoutPassword } = user;
        return NextResponse.json(userWithoutPassword);
    } catch (error: any) {
        console.error('Registration error:', error);
        return NextResponse.json(
            { error: 'Failed to register', details: error.message },
            { status: 500 }
        );
    }
}
