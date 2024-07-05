import { queueTypesJson } from "../queueType";

export const queueDataFn = (queueId: number) => {
  const queueTypesMap = queueTypesJson.map((queueType) => {
    var queueFormated;
    if (queueId === queueType.queueId) {
      queueFormated = {
        queueDescription: queueType.description,
        map: queueType.map,
        notes: queueType.notes,
      };
    }
    return queueFormated;
  });
  const queueRes = queueTypesMap.find((queue) => queue?.map != undefined);
  if (!queueRes) {
    return {
      queueDescription: "Not known",
      map: "Undefined",
      notes: "Could not get any data.",
    };
  }

  return queueRes;
};
