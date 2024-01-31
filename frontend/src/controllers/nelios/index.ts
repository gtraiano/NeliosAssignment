import { NeliosResponseItem } from "../../types";

const fetcher = async (): Promise<NeliosResponseItem[]> => {
    const res = await fetch(`${import.meta.env.BACKEND_URL}:${import.meta.env.BACKEND_PORT}/`)
    return await res.json();
}

export default fetcher;