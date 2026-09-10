import { useCallback, useMemo } from "react";
import useLocalStorage from "./useLocalStorage";

export const DOCUMENTS_STORAGE_KEY = "forestrick-documents";

function createDocumentId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  return `document-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

/**
 * 모든 기능 페이지가 같은 문서 목록을 저장하고 읽기 위한 CRUD Hook
 */
export default function useDocuments() {
  const [documents, setDocuments] = useLocalStorage(DOCUMENTS_STORAGE_KEY, []);

  const addDocument = useCallback(
    ({ title = "제목 없는 문서", category = "문서", source = "unknown", content = "", ...metadata }) => {
      const now = new Date().toISOString();
      const newDocument = {
        ...metadata,
        id: createDocumentId(),
        title,
        category,
        source,
        content,
        createdAt: now,
        updatedAt: now,
      };

      setDocuments((currentDocuments) => [newDocument, ...currentDocuments]);
      return newDocument;
    },
    [setDocuments],
  );

  const updateDocument = useCallback(
    (documentId, changes) => {
      setDocuments((currentDocuments) =>
        currentDocuments.map((document) =>
          document.id === documentId
            ? {
                ...document,
                ...changes,
                id: document.id,
                createdAt: document.createdAt,
                updatedAt: new Date().toISOString(),
              }
            : document,
        ),
      );
    },
    [setDocuments],
  );

  const deleteDocument = useCallback(
    (documentId) => {
      setDocuments((currentDocuments) => currentDocuments.filter((document) => document.id !== documentId));
    },
    [setDocuments],
  );

  const getDocumentById = useCallback(
    (documentId) => documents.find((document) => document.id === documentId),
    [documents],
  );

  return useMemo(
    () => ({ documents, addDocument, updateDocument, deleteDocument, getDocumentById }),
    [documents, addDocument, updateDocument, deleteDocument, getDocumentById],
  );
}
