'use client';

import { useSession } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem } from './ui/form';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { addDoc, getDocs, serverTimestamp } from 'firebase/firestore';
import { User, limitedMessageRef, messageRef } from '@/lib/converters/Message';
import { useRouter } from 'next/navigation';
import { useSubscriptionStore } from '@/store/store';
import { useToast } from './ui/use-toast';
import { ToastAction } from './ui/toast';

type Props = {
  chatId: string;
};

const formSchema = z.object({
  input: z.string().max(1000),
});

function ChatInput({ chatId }: Props) {
  const { data: session } = useSession();
  const router = useRouter();
  const {toast} = useToast();
  const subscription = useSubscriptionStore((state) => state.subscription);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      input: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const inputCopy = values.input.trim();
    form.reset();

    if (inputCopy.length === 0) {
      return;
    }

    if (!session?.user) {
      return;
    }

    const messages = (await getDocs(limitedMessageRef(chatId))).docs.map(
        (doc) => doc.data()
    ).length;

    const isPro = subscription?.role === "pro" && subscription.status === "active";

    if (!isPro && messages >= 20){
        toast({
            title: "Free plan limit exceeded",
            description: 
               "You've exceeded the FREE plan limit of 20 messages per chat. Upgrade to PRO for unlimited chat messages!",
            variant: "destructive",
            action: (
                <ToastAction 
                  altText='Upgrade'
                  onClick={() => router.push("/register")}
                  >
                    Upgrade To Pro
                  </ToastAction>
            ),
        });

        return;
    }

    const userToStore: User = {
      id: session.user.id!,
      name: session.user.name!,
      email: session.user.email!,
      image: session.user.image || '',
    };

    addDoc(messageRef(chatId), {
      input: inputCopy,
      timestamp: serverTimestamp(),
      user: userToStore,
    });

  }
  return (
    <div className="sticky bottom-0">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex space-x-2 p-2 rounded-t-xl max-w-4xl mx-auto bg-white dark:bg-slate-800"
        >
          <FormField
            control={form.control}
            name="input"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormControl>
                  <Input
                    className="border-none bg-transparent dark:placeholder:text-white/70"
                    placeholder="Enter message in Any Language..."
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <Button type="submit" className="bg-violet-600 text-white">
            Send
          </Button>
        </form>
      </Form>
    </div>
  );
}

export default ChatInput;
