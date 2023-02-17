import axios from "axios";

export default function Fetcher(url: string) {
  const splitedUrlArray = url.split("+and");
  return axios.get<any>(splitedUrlArray[0], {
    headers: {
      Authorization: `Bearer ${splitedUrlArray[1]}`,
      Accept: "application/json",
      "Content-Type": "application/json",
      admin: "Oluwadamilare",
      token: splitedUrlArray[1],
    },
  });
}
