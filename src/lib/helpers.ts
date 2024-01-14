import { Stream } from "stream";

// export const streamToString = (stream: any) => {
//   const chunks: any = [];
//   return new Promise((resolve, reject) => {
//     console.log({ stream });
//     stream?.on("data", chunk => chunks.push(Buffer.from(chunk)));
//     stream?.on("error", err => reject(err));
//     stream?.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
//   });
// };
export const streamToString = async (stream: any) => {
  // lets have a ReadableStream as a stream variable
  const chunks = [];

  for await (const chunk of stream) {
    chunks.push(Buffer.from(chunk));
  }

  return Buffer.concat(chunks).toString("utf-8");
};
export const streamAsyncIterator = (stream: any) => {
  // Get a lock on the stream:
  const reader = stream.getReader();

  return {
    next() {
      // Stream reads already resolve with {done, value}, so
      // we can just call read:
      return reader.read();
    },
    return() {
      // Release the lock if the iterator terminates.
      reader.releaseLock();
      return {};
    },
    // for-await calls this on whatever it's passed, so
    // iterators tend to return themselves.
    [Symbol.asyncIterator]() {
      return this;
    }
  };
};
