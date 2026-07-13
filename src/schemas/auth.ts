import { z } from 'zod'

const email = z.email('올바른 이메일 형식이 아니에요')

const password = z
  .string()
  .min(8, '비밀번호는 8자 이상이어야 해요')

export const loginSchema = z.object({
  email,
  password,
})

export type LoginFormValues = z.infer<typeof loginSchema>

export const signupSchema = z
  .object({
    email,
    nickname: z
      .string()
      .min(1, '닉네임을 입력해주세요')
      .max(10, '닉네임은 10자 이하여야 해요'),
    password,
    passwordConfirm: z.string().min(1, '비밀번호를 다시 입력해주세요'),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: '비밀번호가 일치하지 않아요',
    path: ['passwordConfirm'],
  })

export type SignupFormValues = z.infer<typeof signupSchema>
