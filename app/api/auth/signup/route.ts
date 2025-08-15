import { NextRequest, NextResponse } from "next/server";
import { TABLE_NAMES } from "../../../../constant/tables.constant";
import { supabase } from "../../../../utils/supabaseClient";

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json();

    // Validation
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters long" },
        { status: 400 }
      );
    }

    // Sign up with Supabase Auth
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp(
      {
        email,
        password,
      }
    );

    if (signUpError) {
      console.error("Supabase signup error:", signUpError);
      return NextResponse.json({ error: signUpError.message }, { status: 400 });
    }

    const user = signUpData.user;
    if (!user) {
      return NextResponse.json(
        { error: "User creation failed" },
        { status: 500 }
      );
    }

    const { error: profileError } = await supabase
      .from(TABLE_NAMES.users) 
      .insert([
        {
          id: user.id, // same as auth.users.id
          name,
          email,
        },
      ]);

    if (profileError) {
      console.error("Profile insert error:", profileError);
      return NextResponse.json(
        { error: "Failed to save profile data" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        message: "User created successfully",
        user: {
          id: user.id,
          name,
          email,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
