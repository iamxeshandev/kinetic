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
  ...props
}: FormRichTextEditorProps) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <RichTextEditor
          extensions={extensions}
          content={field.value}
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
          {...props}
        />
      )}
    />
  );
}
