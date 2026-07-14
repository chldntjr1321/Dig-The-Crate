import { z } from 'zod'

const email = z.email('올바른 이메일 형식이 아니에요')

// 로그인은 형식 검증 없이 "입력 여부"만 확인한다.
// 형식이 맞고 틀리고를 떠나 로그인 실패 사유는 서버 응답(authError) 하나로 통일한다.
const loginPassword = z.string().min(1, '비밀번호를 입력하세요')

const signupPassword = z
  .string()
  .min(8, '비밀번호는 8자 이상이어야 해요')

export const loginSchema = z.object({
  email,
  password: loginPassword,
})

export type LoginFormValues = z.infer<typeof loginSchema>

export const signupSchema = z
  .object({
    email,
    nickname: z
      .string()
      .min(1, '닉네임을 입력해주세요')
      .max(10, '닉네임은 10자 이하여야 해요'),
    password: signupPassword,
    passwordConfirm: z.string().min(1, '비밀번호를 다시 입력해주세요'),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: '비밀번호가 일치하지 않아요',
    path: ['passwordConfirm'],
  })

export type SignupFormValues = z.infer<typeof signupSchema>
