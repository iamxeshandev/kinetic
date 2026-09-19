import { FormControl, FormHelperText } from '@mui/material';
import type { Content } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
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
  type RichTextEditorRef,
} from 'mui-tiptap';
import { useEffect, useRef } from 'react';
import { useController, useFormContext } from 'react-hook-form';

export type FormRichTextEditorProps = Omit<
  RichTextEditorProps,
  'extensions'
> & {
  name: string;
};

export function FormRichTextEditor({
  name,
  onUpdate,
  ...props
}: FormRichTextEditorProps) {
  const { control } = useFormContext();
  const { field, fieldState } = useController({ name, control });
  const editorRef = useRef<RichTextEditorRef>(null);
  const lastEditorContent = useRef<string | undefined>(undefined);

  useEffect(() => {
    const editor = editorRef.current?.editor;
    const nextContent = JSON.stringify(field.value ?? null);

    if (!editor || nextContent === lastEditorContent.current) return;

    editor.commands.setContent(field.value as Content, { emitUpdate: false });
    lastEditorContent.current = nextContent;
  }, [field.value]);

  return (
    <FormControl fullWidth error={!!fieldState.error}>
      <RichTextEditor
        {...props}
        ref={editorRef}
        extensions={[StarterKit]}
        content={field.value}
        onUpdate={(updateProps) => {
          const value = updateProps.editor.getJSON();
          lastEditorContent.current = JSON.stringify(value);
          field.onChange(value);
          onUpdate?.(updateProps);
        }}
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
  );
}
