import axios from "axios";
import { ComputeResponse } from "interfaces";

export async function computeString(
  expression: string
): Promise<[ComputeResponse | null, ComputeResponse | null]> {
  try {
    const url = process.env.REACT_APP_API_URL + "/compute";
    const response = await axios.post(url, { expression });
    return [response.data as ComputeResponse, null];
  } catch (e) {
    console.error(e.response.data);
    return [null, e.response.data as ComputeResponse];
  }
}
