
import { neon } from '@neondatabase/serverless';
import { revalidatePath } from 'next/cache';
import { Suspense } from 'react';

const sql = neon(process.env.DATABASE_URL!);

async function addMessage(formData: FormData) {
  'use server';

  const message = String(
    formData.get('message') ?? ''
  ).trim();

  if (!message) return;

  await sql`
    INSERT INTO messages (message)
    VALUES (${message})
  `;

  revalidatePath('/');
}

async function Messages() {
  const messages = await sql`
    SELECT * FROM messages
    ORDER BY id DESC
  `;

  return (
    <div>
      {messages.map((item) => (
        <div
          key={item.id}
          style={{
            padding: '12px',
            marginTop: '10px',
            background: '#eeeeee',
            color: 'black',
            borderRadius: '5px'
          }}
        >
          {item.message}
        </div>
      ))}
    </div>
  );
}

export default function Home() {
  return (
    <main
      style={{
        maxWidth: '700px',
        margin: '50px auto',
        padding: '20px',
        fontFamily: 'Arial'
      }}
    >
      <h1>Менің алғашқы веб-қосымшам</h1>

      <p>
        Бұл қосымша Neon бұлттық деректер қорымен
        жұмыс істейді.
      </p>

      <form action={addMessage}>
        <input
          name="message"
          placeholder="Хабарлама енгізіңіз"
          required
          style={{
            padding: '12px',
            width: '70%',
            marginRight: '10px',
            color: 'black',
            backgroundColor: 'white'
          }}
        />

        <button type="submit">
          Сақтау
        </button>
      </form>

      <h2>Хабарламалар тізімі</h2>

      <Suspense fallback={<p>Жүктелуде...</p>}>
        <Messages />
      </Suspense>
    </main>
  );
}
