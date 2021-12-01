import moment from "moment";

import {
  register,
  deserialize,
} from "@projectcaluma/ember-testing/mirage-graphql";
import BaseMock from "@projectcaluma/ember-testing/mirage-graphql/mocks/base";

export default class extends BaseMock {
  _handleSaveDocumentAnswer(
    _,
    {
      question: questionSlug,
      document: documentId,
      clientMutationId,
      value,
      type,
    }
  ) {
    const questionId = this.db.questions.findBy({ slug: questionSlug }).id;

    const answer = this.collection.findBy({ questionId, documentId });

    const res = this.handleSavePayload.fn.call(this, _, {
      input: {
        id: answer && answer.id,
        type,
        value,
        documentId,
        questionId,
        clientMutationId,
      },
    });

    // Default answers don't have a document.
    if (res.answer.documentId) {
      const doc = this.db.documents.findBy({ id: res.answer.documentId });

      const { id } = deserialize(res.answer);
      this.db.documents.update(doc.id, {
        answerIds: [...new Set([...(doc.answerIds || []), id])],
      });
    }

    return res;
  }

  @register("SaveDocumentStringAnswerPayload")
  @register("SaveDefaultStringAnswerPayload")
  handleSaveDocumentStringAnswer(_, { input }) {
    return this._handleSaveDocumentAnswer(_, {
      ...input,
      value: input.value ? String(input.value) : null,
      type: "STRING",
    });
  }

  @register("SaveDocumentIntegerAnswerPayload")
  @register("SaveDefaultIntegerAnswerPayload")
  handleSaveIntegerAnswer(_, { input }) {
    return this._handleSaveDocumentAnswer(_, {
      ...input,
      value: input.value ? parseInt(input.value) : null,
      type: "INTEGER",
    });
  }

  @register("SaveDocumentFloatAnswerPayload")
  @register("SaveDefaultFloatAnswerPayload")
  handleSaveFloatAnswer(_, { input }) {
    return this._handleSaveDocumentAnswer(_, {
      ...input,
      value: input.value ? parseFloat(input.value) : null,
      type: "FLOAT",
    });
  }

  @register("SaveDocumentListAnswerPayload")
  @register("SaveDefaultListAnswerPayload")
  handleSaveListAnswer(_, { input }) {
    return this._handleSaveDocumentAnswer(_, {
      ...input,
      value: input.value ? [...input.value].map(String) : null,
      type: "LIST",
    });
  }

  @register("SaveDocumentFileAnswerPayload")
  handleSaveFileAnswer(_, { input }) {
    return this._handleSaveDocumentAnswer(_, {
      ...input,
      value: input.value ? { metadata: { object_name: input.value } } : null,
      type: "FILE",
    });
  }

  @register("SaveDocumentDateAnswerPayload")
  @register("SaveDefaultDateAnswerPayload")
  handleSaveDateAnswer(_, { input }) {
    const date = input.value;
    const value = date
      ? moment({
          day: date.getUTCDate(),
          month: date.getUTCMonth(),
          year: date.getUTCFullYear(),
        }).format(moment.HTML5_FMT.DATE)
      : null;

    return this._handleSaveDocumentAnswer(_, {
      ...input,
      value,
      type: "DATE",
    });
  }
}