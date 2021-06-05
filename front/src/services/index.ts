import axios from "axios";

export async function computeString(text: string): Promise<[string | null, any]> {
  try {
    const url = process.env.REACT_APP_API_URL + "/compute";
    const response = await axios.post(url, { text });
    return [response.data, null];
  } catch (e) {
    console.error(e);
    return [null, e];
  }
}
