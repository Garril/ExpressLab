import request from "./request";

function delay(duration) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, duration);
  })
}

export async function loginIn(loginId, loginPwd) {
  await delay(1500);
  const res = await request().post("/api/admin/login", {
    loginId,
    loginPwd,
  });
  return res.data;
}

export function loginOut() {
  localStorage.removeItem("token");
  document.cookie = `token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}

export async function getUserInfo() {
  await delay(1500);
  const res = await request().get("/api/admin/whoami");
  return res.data;
}