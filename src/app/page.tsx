import Form from "@/components/Form";

import Layout from "@/components/Layout";
export default async function Home() {
  return (
    <Layout>
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <div className="w-full max-w-[600px]">
          <Form />
        </div>
      </main>
    </Layout>
  );
  // return (
  //   <main className="flex min-h-screen flex-col items-center justify-between p-24">
  //     <div className="w-full max-w-[600px]">
  //       <Form />
  //       <Subscriptions subscriptions={subscriptions} />
  //     </div>
  //   </main>
  // );
}
