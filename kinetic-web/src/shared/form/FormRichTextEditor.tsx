import { FormControl, FormHelperText } from '@mui/material';
import { StarterKit } from '@tiptap/starter-kit';
import {
  MenuButtonBold,
  MenuButtonBulletedList,
  MenuButtonItalic,
  MenuButtonOrderedList,
  MenuButtonUnderline,
  MenuControlsContainer,
  MenuDivider,
  RichTextEditor,
  type RichTextEditorProps,
} from 'mui-tiptap';
import { Controller, useFormContext } from 'react-hook-form';

export type FormRichTextEditorProps = Omit<
  RichTextEditorProps,
  'extensions'
> & {
  name: string;
  extensions?: RichTextEditorProps['extensions'];
};

export function FormRichTextEditor({
  name,
  extensions = [StarterKit],
  onUpdate,
  RichTextFieldProps,
  ...props
}: FormRichTextEditorProps) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <FormControl fullWidth error={!!fieldState.error}>
          <RichTextEditor
            {...props}
            extensions={extensions}
            content={field.value}
            onUpdate={(updateProps) => {
              field.onChange(updateProps.editor.getJSON());
              onUpdate?.(updateProps);
            }}
            RichTextFieldProps={RichTextFieldProps}
            renderControls={() => (
              <MenuControlsContainer>
                <MenuButtonBold />
                <MenuButtonItalic />
                <MenuButtonUnderline />
                <MenuDivider />
                <MenuButtonBulletedList />
                <MenuButtonOrderedList />
              </MenuControlsContainer>
            )}
          />
          <FormHelperText>{fieldState.error?.message}</FormHelperText>
        </FormControl>
      )}
    />
  );
}
