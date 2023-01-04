const logsSaving = (ids) => {
  try {
    if (existsSync(logPath)) {
      let logs = readFileSync(logPath, { encoding: "utf-8" });
      let logsParse = JSON.parse(logs);
      let newLogs = logsParse.concat(userIds);

      updateLog(logPath, JSON.stringify(newLogs + "")).then(() => {
        let logs = readFileSync(logPath, { encoding: "utf-8" });
        let logsParse = JSON.parse(logs);
        const a = logsParse.split(",");
        let unique = [...new Set(a)];
        console.log(unique.length);
        // writeFileSync(logPath, JSON.stringify(unique))
      });
    } else {
      writeFileSync(logPath, JSON.stringify(userIds));
    }
  } catch (error) {
    console.log(error);
    return error;
  }
};
