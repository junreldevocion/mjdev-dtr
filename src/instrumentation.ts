import '@/model'

import { connectToMongoDB } from "./lib/mongodb";

export async function register() {
  await connectToMongoDB();
}