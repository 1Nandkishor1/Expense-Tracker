import {
  createSettlement,
  getGroupSettlements,
  confirmSettlement,
  uploadScreenshot,
} from "../services/settlementService";

import { getGroupBalance } from "../../group/services/groupService";
import { useState, useEffect } from "react";

export function useSettlements(id) {
  const [loading, setloading] = useState(true);
  const [settlements, setsettlements] = useState([]);
  const [balances, setBalances] = useState(null);
  const [error, seterror] = useState(null);

  useEffect(() => {
    getGroupSettlementsHook();
  }, [id]);

  async function getGroupSettlementsHook() {
    try {
      setloading(true);

      const [settlementRes, balanceRes] = await Promise.all([
        getGroupSettlements(id),
        getGroupBalance(id),
      ]);

      setsettlements(settlementRes.settlements);
      setBalances(balanceRes);
    } catch (err) {
      seterror(err.message);
    } finally {
      setloading(false);
    }
  }

  async function createSettlementHook(paidBy, amount) {
    try {
      let response = await createSettlement(id, paidBy, amount);

      setsettlements((prev) => [
        response.settlement,
        ...prev,
      ]);

      const balanceRes = await getGroupBalance(id);
      setBalances(balanceRes);
    } catch (err) {
      throw err;
    }
  }

  async function confirmSettlementHook(settlementId) {
    try {
      await confirmSettlement(settlementId);

      setsettlements((prev) =>
        prev.map((s) =>
          s._id === settlementId
            ? { ...s, isSettled: true }
            : s
        )
      );

      const balanceRes = await getGroupBalance(id);
      setBalances(balanceRes);
    } catch (err) {
      throw err;
    }
  }

  async function uploadScreenshotHook(settlementId, file) {
    try {
      let response = await uploadScreenshot(settlementId, file);

      setsettlements((prev) =>
        prev.map((s) =>
          s._id === settlementId
            ? { ...s, screenshot: response.screenshot }
            : s
        )
      );
    } catch (err) {
      throw err;
    }
  }

  return {
    loading,
    settlements,
    balances,
    error,
    getGroupSettlementsHook,
    createSettlementHook,
    confirmSettlementHook,
    uploadScreenshotHook,
  };
}