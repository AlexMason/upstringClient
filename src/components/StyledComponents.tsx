import { ChangeEventHandler } from "react";
import tw from "tailwind-styled-components";

// CONTAINERS ================================================
export const LoginRegisterBox = tw.div`w-7/12 bg-gray-700 mx-auto p-12`;
export const NewTopicBox = tw.div`w-9/12 bg-gray-700 mx-auto p-12`;

// FORMS =====================================================
export const Form = tw.div`flex flex-col`;
export const FormRow = tw.div`flex gap-3`;
export const FormGroup = tw.div<{ $inline?: boolean }>`
  flex
  flex-grow
  ${(p) => (p.$inline ? "flex-row gap-2" : "flex-col")}
`;
export const Label = tw.label``;
export const Input = tw.input`mb-2 p-1 rounded-none text-black flex-grow focus:rounded-none`;
export const Textarea = tw.textarea`mb-2 p-1 rounded-none text-black flex-grow`;
export const Button = tw.button`border rounded-none px-1 uppercase`;

type FormInputProps = {
  id: string;
  label: string;
  value: string;
  type?: string;
  onChange?: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>;
  inline?: boolean;
};

export const FormInput = (props: FormInputProps) => {
  let textAreaRows =
    props.value.split("\n").length < 3
      ? 3
      : props.value.split("\n").length > 10
      ? 10
      : props.value.split("\n").length;

  return (
    <FormGroup $inline={props.inline}>
      <Label htmlFor={props.id}>{props.label}</Label>
      {props.type && props.type === "textarea" ? (
        <>
          <Textarea
            rows={textAreaRows}
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
  );
};
