import { useEffect, useRef } from 'react';
import { Editor as TinyMCEEditor } from '@tinymce/tinymce-react';

interface EditorProps {
  value: string;
  onChange: (content: string) => void;
}

export default function Editor({ value, onChange }: EditorProps) {
  const editorRef = useRef<any>(null);

  return (
    <TinyMCEEditor
      apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY}
      onInit={(evt, editor) => editorRef.current = editor}
      value={value}
      onEditorChange={(content) => onChange(content)}
      init={{
        height: 500,
        menubar: true,
        plugins: [
          'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
          'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
          'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
        ],
        toolbar: 'undo redo | blocks | ' +
          'bold italic forecolor | alignleft aligncenter ' +
          'alignright alignjustify | bullist numlist outdent indent | ' +
          'removeformat | help',
        content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
        language: 'zh_CN',
        language_url: '/tinymce/langs/zh_CN.js',
      }}
    />
  );
} 