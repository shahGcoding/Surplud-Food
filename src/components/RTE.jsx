import React, { useEffect } from "react";
import { Controller } from "react-hook-form";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { $getRoot } from "lexical";

function RTE({ name, control, label, defaultValue = "" }) {
  const initialConfig = {
    namespace: "MyEditor",
    theme: { paragraph: "mb-2" },
    onError: (error) => console.error(error),
  };

  return (
    <div className="w-full bg-blue-50">
      {label && (
        <label className="block text-gray-700 font-semibold mb-1">
          {label}
        </label>
      )}
      <Controller
        name={name || "content"}
        control={control}
        defaultValue={defaultValue}
        render={({ field: { onChange } }) => (
          <LexicalComposer initialConfig={initialConfig}>
            <div className="border border-gray-300 rounded-lg p-2 bg-white shadow-sm">
              {<div className=" py-2 text-gray-400">Type something...</div>}
              <RichTextPlugin placeholder={"type"}
                contentEditable={
                  <ContentEditable
                    className="min-h-[250px] w-full p-3 resize-y overflow-auto
                             rounded-md text-gray-800 focus:ring-2 border"         
                  />
                }
              />
              <HistoryPlugin />
              <OnChangePlugin
                onChange={(editorState) => {
                  editorState.read(() => {
                    const editorContent = $getRoot().getTextContent();
                    onChange(editorContent);
                  });
                }}
              />
            </div>
          </LexicalComposer>
        )}
      />
    </div>
  );
}

export default RTE;
