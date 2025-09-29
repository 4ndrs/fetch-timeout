const fetchWithSignal = (ms: number) => {
  console.log("starting fetch with signal...");

  return fetch("/wait?ms=" + ms, { signal: AbortSignal.timeout(2000) });
};

const fetchWithRace = (ms: number) => {
  console.log("starting fetch with race...");

  const abortPromise = new Promise<never>((_, reject) =>
    setTimeout(
      () => reject(new DOMException("Request reached timeout", "TimeoutError")),
      2000,
    ),
  );

  const fetchPromise = fetch("/wait?ms=" + ms);

  return Promise.race([fetchPromise, abortPromise]);
};

const fetchTest = async (fetch: (ms: number) => Promise<Response>) => {
  const ms = 20000;

  try {
    await fetch(ms);

    console.log(`fetch ended after waiting for ${ms} ms`);
  } catch (error) {
    if (error instanceof Error && error.name === "TimeoutError") {
      console.log("fetch aborted with TimeoutError");
      return;
    }

    throw error;
  }
};

const button1 = document.getElementById("test-1");
const button2 = document.getElementById("test-2");

button1?.addEventListener("click", () => fetchTest(fetchWithSignal));
button2?.addEventListener("click", () => fetchTest(fetchWithRace));
