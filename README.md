# SvelteKit Email Password Authentication Utilities

This package provides utility functions for email password authentication in SvelteKit applications.
You can add Email Password Authentication to your SvelteKit application in just a few minutes.

## Requirements

1. Have a database set up and connected to your SvelteKit application. You can use whatever you want. I suggest Prisma for simplicity. ([Prisma Getting Started Guide](https://www.prisma.io/docs/getting-started))

## Installation

```bash
npm i @jannikkoester/svelte-simple-auth
```

## How to use it

1. Create .env file in your root directory and paste the following(Just use your own db credentials)

```env
DATABASE_URL="your db credentials
JWT_SECRET=supersecret
BCRYPT_SALT=12
```

1. Create a Register page

```html

<form
    method="post"

   >

     <label for="email">Email</label>
     <input type="email" name="email" placeholder="Email" required />

     <label for="email">Password</label>
     <input type="password" name="password" placeholder="Passwort" required />


     <button class="mt-2" type="submit">Register</button>

   </form>
```

Create a +page.server.ts in the same directory

```typescript

import { fail, redirect } from '@sveltejs/kit';
import { generateJwtToken, hashPasswordBcrypt } from '@jannikkoester/svelte-simple-auth';

import { BCRYPT_SALT, JWT_SECRET } from '$env/static/private';

import type { Actions } from './$types';
import { client } from '../../../lib/server/db';

export const actions: Actions = {
 default: async (event) => {
        // Get Email and password from form
  const formData = await event.request.formData();
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
// make some validation
  if (typeof password !== 'string' || password.length < 6 || password.length > 255) {
   return fail(400, {
    message: 'Email or password wrong'
   });
  }
        // does the user already exist? throw an error
  const userAlreadyExists = await client.user.findUnique({
   where: {
    email: email
   }
  });
  if (userAlreadyExists) {
   return fail(400, {
    message: 'Email already in use'
   });
  }

// hash the password with the utility function from this package
  const hashedPassword = await hashPasswordBcrypt(password, parseInt(BCRYPT_SALT));


// Create the user
  const newUser = await client.user.create({
   data: {
    email: email,
    hashed_password: hashedPassword
   }
  });
        // provide the token duration
  const tokenDuration = '1d';
        // generate the jwt with the utility function from this package
  const token = await generateJwtToken({ id: newUser.id }, JWT_SECRET, tokenDuration);
        // set the duration of the cookie
  const oneDayCookieDuration = 60 * 60 * 24;
  event.cookies.set('token', token, {
   path: '.',
   httpOnly: process.env.NODE_ENV === 'production',
   maxAge: oneDayCookieDuration
  });

  redirect(302, '/protected/dashboard');
 }
};
```

Same is for login,except you need to check if the user exists and if the password is correct.
You can use the utility function from our package

```typescript
const isPasswordCorrect = await comparePasswordBcrypt(password, user.hashed_password);
```

### Protected Routes

Create a hooks.server.ts file inside the src directory

```typescript
import type { Handle } from '@sveltejs/kit';

import { verifyJwtToken } from '@jannikkoester/svelte-simple-auth';
import { JWT_SECRET } from '$env/static/private';

export const handle: Handle = async ({ event, resolve }) => {
 const desiredUrl = event.url.pathname;
// this is are protected paths
 if (desiredUrl.startsWith('/protected')) {
    // get the token from the cookie
  const token = event.cookies.get('token');
  if (!token) {
   return new Response(null, {
    status: 303,
    headers: { Location: '/login' }
   });
  }

  // an error occures while validating the token, remove the cookie and redirect to login
  try {
    // decrypt the token with the utility function from our package
   const decryptedTokenPayload = await verifyJwtToken(token, JWT_SECRET);
   event.locals.user = decryptedTokenPayload;
  } catch (error) {
   event.cookies.set('token', '', { path: '/', expires: new Date(0) });
   return new Response(null, {
    status: 303,
    headers: { Location: '/login' }
   });
  }

  return resolve(event);
 }
 event.locals.user = null;

 return resolve(event);
};
```

Now create a +layout.server.ts inside src/(protected)/protected/dashboard

```typescript

import type { LayoutServerLoad } from './protected/$types';

export const load = (async (event) => {
 return { user: event.locals.user };
}) satisfies LayoutServerLoad;
```

#### Done

Now you can access the user in your server files and use it in your svelte files

```typescript
export const load = (async (event) => {
 return { user: event.locals.user };
})
```

Svelte file

```svelte
<script>
  export let data
</script>

{JSON.stringify(data.user, null, 2)}
```
