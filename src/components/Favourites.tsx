import React from "react";
import { useTranslation } from "react-i18next";

export default function Favourites() {
  const { t } = useTranslation();

  return (
    <div>
      <button>{t("clearAll")}</button>
    </div>
  );
}
