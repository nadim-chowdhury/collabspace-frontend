import Image from "next/image";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="h-screen bg-white grid grid-cols-3">
      <div className="p-8 col-span-2">
        <Image
          src="https://images.pexels.com/photos/4065876/pexels-photo-4065876.jpeg"
          alt=""
          height={1080}
          width={1920}
          className="w-full h-full object-cover rounded-2xl shadow"
        />
      </div>

      <div className="flex items-center justify-center col-span-1">
        {children}
      </div>
    </section>
  );
}
