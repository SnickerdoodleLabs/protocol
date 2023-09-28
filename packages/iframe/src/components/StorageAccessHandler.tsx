import { Result, ResultAsync, okAsync } from "neverthrow";
import React, { useEffect, FC } from "react";

interface IStorageHandlerProps {
  callback: () => void;
  show: () => void;
  hide: () => void;
}

export const StorageHandler: FC<IStorageHandlerProps> = ({
  callback,
  show,
  hide,
}) => {
  const [permissionRequired, setPermissionRequired] = React.useState(false);
  useEffect(() => {
    handleStorageAccess();
  }, []);

  useEffect(() => {
    if (permissionRequired) {
      show();
    }
  }, [permissionRequired]);

  const onComplete = () => {
    callback();
  };

  const handleStorageAccess = () => {
    // @ts-ignore
    if (document.hasStorageAccess) {
      return ResultAsync.fromPromise(
        document.hasStorageAccess(),
        (error) => error,
      ).andThen((hasStorageAccess) => {
        if (hasStorageAccess) {
          onComplete();
          return okAsync(undefined);
        }
        return ResultAsync.fromPromise(
          // @ts-ignore
          navigator.permissions.query({ name: "storage-access" }),
          (error) => error,
        )
          .andThen((permission) => {
            switch (permission.state) {
              case "granted":
                return ResultAsync.fromPromise(
                  document.requestStorageAccess(),
                  (e) => e,
                ).map(() => {
                  onComplete();
                });
              case "prompt":
                // need to ask for permission
                // show the iframe and ask for permission
                console.log("Permission state for storage access is prompt");
                setPermissionRequired(true);
                return okAsync(undefined);
              case "denied":
                // give error or inform user that we need permission
                console.log("User denied storage access");
                onComplete();
                return okAsync(undefined);
            }
          })
          .mapErr((e) => {
            console.log("Error while checking storage access", e);
            onComplete();
          });
      });
    } else {
      // there is nothing we can  do here
      console.log("Permission state for storage access is not supported");
      onComplete();
      return okAsync(undefined);
    }
  };

  const handlePrompt = () => {
    // @ts-ignore
    return ResultAsync.fromPromise(
      document.requestStorageAccess?.() ?? okAsync(undefined),
      (e) => e,
    )
      .map(() => {
        hide();
        onComplete();
      })
      .mapErr((e) => {});
  };

  return (
    <div>
      Provide Snickerdoodle to access 3rd party cookies
      <img src="https://i.imgur.com/6X2x6ZP.png" onClick={handlePrompt} />
    </div>
  );
};
