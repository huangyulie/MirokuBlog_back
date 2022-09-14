// @ts-ignore
/* eslint-disable */
import { request } from 'umi';

/** 获取当前的用户 GET /api/currentUser */
export async function currentUser(options?: { [key: string]: any }) {
  return request<{
    data: API.CurrentUser;
  }>('/api/currentUser', {
    method: 'GET',
    ...(options || {}),
  });
}

// 获取建站日期
export async function build(options?: { [key: string]: any }) {
  return request<{
    data: API.BuildIprops;
  }>('/api/build/build', {
    method: 'GET',
    ...(options || {}),
  });
}

// 删除建站
export async function buildDelete(options?: { [ key: string]: any}){
  return request('/api/build/delete',{
    method:'POST',
    ...(options || {}),
  })
}
// 添加
export async function buildAdd(options?: { [ key: string]: any}){
  return request('/api/build/add',{
    method:'POST',
    ...(options || {}),
  })
}

// 修改
export async function buildChange(options?: { [ key: string]: any}){
  return request('/api/build/change',{
    method:'POST',
    ...(options || {}),
  })
}


/** 退出登录接口 POST /api/login/outLogin */
export async function outLogin(options?: { [key: string]: any }) {
  return request<Record<string, any>>('/api/outLogin', {
    method: 'POST',
    ...(options || {}),
  });
}

/** 登录接口 POST /api/login/account */
export async function login(body: API.LoginParams, options?: { [key: string]: any }) {
  return request<API.LoginResult>('/api/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

export async function about(options?: { [key: string]: any }) {
  return request('/api/about/about', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    ...(options || {}),
  });
}

export async function aboutchange(options?: { [key: string]: any }) {
  return request('/api/about/change', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    ...(options || {}),
  });
}