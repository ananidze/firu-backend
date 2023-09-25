type JSONObject = { [key: string]: any };

const sanitezeJSONObjectProperties = (
  jsonObj: JSONObject,
  properties: string[],
): JSONObject => {
  const obj: JSONObject = {};

  for (const key in jsonObj) {
    if (properties.includes(key)) obj[key] = jsonObj[key];
  }

  return obj;
};

export const sanitezeUser = (user: JSONObject): JSONObject => {
  const props: string[] = ['_id', 'email', 'role', 'avatar', 'username'];
  return sanitezeJSONObjectProperties(user, props);
};
