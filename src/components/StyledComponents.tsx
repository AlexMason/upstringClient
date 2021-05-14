import tw from "tailwind-styled-components";

// CONTAINERS ================================================
export const LoginRegisterBox = tw.div`w-7/12 bg-gray-700 mx-auto p-12`;

// FORMS =====================================================
export const Form = tw.form`flex flex-col`;
export const FormRow = tw.div`flex gap-3`;
export const FormGroup = tw.div<{ $inline?: boolean }>`
  flex
  flex-grow
  ${(p) => (p.$inline ? "flex-row gap-2" : "flex-col")}
`;
export const Label = tw.label``;
export const Input = tw.input`mb-2 p-1 rounded-none text-black flex-grow`;
export const Button = tw.button`border`;
