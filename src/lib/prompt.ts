export function createContextualChunkPrompt(wholeDocument: string, chunkContent: string): string {
  return `
  <document>
  ${wholeDocument}
  </document>

  Here is the chunk we want to situate within the whole document 
  
  <chunk> 
  ${chunkContent}
  </chunk> 

Given the document Above, I want you to explain include meaning of the chunk in the context of the whole document above.

Make sure:

Do not include the word 'chunk', 'document' and 'this section' like word in your response.
Do not include any information that is not present in the chunk or document.
Do not include any information that is not relevant to the chunk's context.
DO not include prompt instructions in your response.

Respond only with the succinct context.`;
}
