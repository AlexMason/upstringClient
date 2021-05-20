import { ChangeEventHandler } from "react";
import styled from "styled-components";
import tw from "tailwind-styled-components";

// CONTAINERS ================================================
export const Box = tw.div`bg-black bg-opacity-40 shadow-lg p-4 w-5/12 mx-auto rounded-xl`;
export const LoginRegisterBox = tw(Box)`w-7/12`;
export const NewTopicBox = tw(Box)`w-9/12`;

// FORMS =====================================================
export const Form = tw.div`flex flex-col mx-4 my-2`;

export const FormGroup = tw.div<{ $inline?: boolean }>`flex ${(p) =>
  p.$inline ? "flex-row" : "flex-col"} mb-3`;

export const Label = tw.label`font-medium`;
export const Hint = tw.div<{ $error?: boolean }>`text-sm pl-1.5 mb-1 ${(p) =>
  p.$error ? "text-red-500 text-opacity-100" : "text-white text-opacity-50"}`;

export const InputPre = styled.input`
  color: rgba(46, 220, 255, 1);
`;
export const Input = tw(InputPre)`
border-none
outline-none
rounded-none
bg-black
bg-opacity-20
ring-2
ring-white
ring-opacity-50
p-1
px-2
mx-1.5
`;

export const Button = tw.button`border rounded-none p-1 px-2`;

export const FormRow = tw.div`flex gap-3`;
export const Textarea = tw.textarea`mb-2 p-1 rounded-none text-black flex-grow`;

type FormInputProps = {
  id: string;
  label: string;
  value: string;
  type?: string;
  onChange?: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>;
  inline?: boolean;
  error?: boolean;
  hint?: string;
};

export const FormInput = (props: FormInputProps) => {
  return (
    <div className="flex flex-col w-full">
      <FormGroup $inline={props.inline}>
        <Label htmlFor={props.id}>{props.label}</Label>
        <Hint $error={props.error}>{props.hint}</Hint>
        {props.type && props.type === "textarea" ? (
          <>
            <Textarea
              rows={3}
              name={props.id}
              id={props.id}
              onChange={props.onChange}
              value={props.value}
            ></Textarea>
          </>
        ) : (
          <Input
            id={props.id}
            type={props.type || "text"}
            value={props.value || ""}
            onChange={props.onChange}
          />
        )}
      </FormGroup>
    </div>
  );
};

export const ValidationMsg = tw.div`
text-red-500
`;
