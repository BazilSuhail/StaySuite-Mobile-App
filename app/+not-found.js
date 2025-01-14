import { Link, Stack } from 'expo-router';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <Link href="/" className='text-base bg-black py-[25px]'>
        <Text>Go to home screen!</Text>
      </Link>
    </>
  );
}

