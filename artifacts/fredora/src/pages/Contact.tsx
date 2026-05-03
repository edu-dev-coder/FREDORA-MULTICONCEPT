import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useCreateMessage, useGetHomepage } from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { MapPin, Mail, Phone, Clock, MessageCircle, Send } from "lucide-react";
import { motion } from "framer-motion";

const formSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email address"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type FormValues = z.infer<typeof formSchema>;

export default function Contact() {
  const { toast } = useToast();
  const createMessage = useCreateMessage();
  const { data: homepage } = useGetHomepage();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", email: "", message: "" },
  });

  function onSubmit(values: FormValues) {
    createMessage.mutate({ data: values }, {
      onSuccess: () => {
        toast({
          title: "Message sent!",
          description: "Thank you for contacting us. We will get back to you shortly.",
        });
        form.reset();
      },
      onError: () => {
        toast({
          variant: "destructive",
          title: "Error",
          description: "There was a problem sending your message. Please try again.",
        });
      }
    });
  }

  const contactItems = [
    {
      icon: MapPin,
      title: "Our Headquarters",
      lines: ["Enugu, Nigeria"],
      color: "from-emerald-500 to-teal-600",
      bg: "from-emerald-50 to-teal-50",
      border: "border-emerald-100",
    },
    {
      icon: Mail,
      title: "Email Us",
      lines: ["info@fredoramulticoncept.com", "support@fredoramulticoncept.com"],
      color: "from-violet-500 to-purple-700",
      bg: "from-violet-50 to-purple-50",
      border: "border-violet-100",
    },
    {
      icon: Phone,
      title: "Call Us",
      lines: [homepage?.whatsappNumber || "+234 (0) 800 000 0000"],
      color: "from-amber-500 to-orange-600",
      bg: "from-amber-50 to-orange-50",
      border: "border-amber-100",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero */}
        <section className="relative py-20 overflow-hidden" style={{ background: 'linear-gradient(135deg, hsl(152, 68%, 22%) 0%, hsl(152, 68%, 32%) 60%, hsl(175, 60%, 28%) 100%)' }}>
          <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1.5px, transparent 0)', backgroundSize: '32px 32px' }} />
          <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-amber-400/10 blur-3xl" />
          <div className="container mx-auto px-4 md:px-6 text-center relative z-10">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <span className="inline-block text-xs font-bold tracking-widest uppercase text-amber-300 bg-white/10 px-4 py-1.5 rounded-full mb-6">
                Contact Us
              </span>
              <h1 className="text-4xl md:text-5xl font-bold font-serif text-white mb-4">Get in Touch</h1>
              <p className="text-lg max-w-2xl mx-auto text-white/80">
                We'd love to hear from you. Whether you have a question, want to place an order, or explore a partnership.
              </p>
            </motion.div>
          </div>
        </section>

        <section className="py-16 md:py-24 bg-gradient-to-br from-emerald-50/50 via-white to-amber-50/50">
          <div className="container mx-auto px-4 md:px-6">
            {/* Contact cards */}
            <div className="grid sm:grid-cols-3 gap-5 max-w-4xl mx-auto mb-16">
              {contactItems.map((item, i) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.1 }}
                  className={`rounded-2xl bg-gradient-to-br ${item.bg} border ${item.border} p-6 text-center`}
                >
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center mx-auto mb-4 shadow-md`}>
                    <item.icon className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">{item.title}</h3>
                  {item.lines.map((line, j) => (
                    <p key={j} className="text-sm text-muted-foreground">{line}</p>
                  ))}
                </motion.div>
              ))}
            </div>

            <div className="grid lg:grid-cols-2 gap-10 max-w-5xl mx-auto">
              {/* Form */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-3xl shadow-lg border p-8 md:p-10"
              >
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-sm shadow-primary/20">
                    <MessageCircle className="h-5 w-5 text-white" />
                  </div>
                  <h2 className="text-2xl font-serif font-bold text-foreground">Send a Message</h2>
                </div>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. Amara Okafor" className="rounded-xl h-11" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Address</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="amara@example.com" className="rounded-xl h-11" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Message</FormLabel>
                          <FormControl>
                            <Textarea placeholder="How can we help you?" className="min-h-[140px] rounded-xl" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" className="w-full h-12 text-base rounded-xl shadow-sm shadow-primary/20" disabled={createMessage.isPending}>
                      {createMessage.isPending ? "Sending…" : (
                        <span className="flex items-center gap-2">
                          Send Message <Send className="h-4 w-4" />
                        </span>
                      )}
                    </Button>
                  </form>
                </Form>
              </motion.div>

              {/* Info panel */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="space-y-6"
              >
                {/* Business hours */}
                <div className="rounded-3xl overflow-hidden shadow-sm border">
                  <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-8 text-white">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
                        <Clock className="h-5 w-5 text-amber-300" />
                      </div>
                      <h3 className="text-xl font-serif font-bold">Business Hours</h3>
                    </div>
                    <ul className="space-y-3.5 text-sm">
                      {[
                        { day: "Monday — Friday", hours: "8:00 AM – 5:00 PM" },
                        { day: "Saturday", hours: "9:00 AM – 2:00 PM" },
                        { day: "Sunday", hours: "Closed" },
                      ].map((row) => (
                        <li key={row.day} className="flex justify-between border-b border-white/10 pb-3.5 last:border-0 last:pb-0">
                          <span className="text-slate-300">{row.day}</span>
                          <span className={`font-semibold ${row.hours === "Closed" ? "text-slate-500" : "text-amber-400"}`}>{row.hours}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* WhatsApp CTA */}
                {homepage?.whatsappNumber && (
                  <div className="rounded-3xl bg-gradient-to-br from-emerald-500 to-teal-600 p-8 text-white shadow-lg shadow-emerald-500/20">
                    <h3 className="text-xl font-serif font-bold mb-2">Chat on WhatsApp</h3>
                    <p className="text-white/80 text-sm mb-5">Get a faster response by chatting with us directly on WhatsApp.</p>
                    <a
                      href={`https://wa.me/${homepage.whatsappNumber.replace(/\D/g, "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-white text-emerald-700 font-semibold px-6 py-2.5 rounded-full hover:bg-emerald-50 transition-colors text-sm shadow-md"
                    >
                      <MessageCircle className="h-4 w-4" />
                      Start Chat
                    </a>
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
