import { Component } from "react";
import { GetHash } from "../utils/Common";

export class BetService extends Component {
  static myInstance = null;

  static getInstance() {
    return new BetService();
  }

  async getCurrentBets() {
    try {
      let response = await fetch(
        "https://bet-royale-bd57d-default-rtdb.firebaseio.com/currentBets.json"
      );

      let responseJson = await response.json();

      return responseJson;
    } catch (error) {
      console.error(error);
    }
  }

  async createBet(data) {
    let url =
      "https://bet-royale-bd57d-default-rtdb.firebaseio.com/currentBets.json";

    return await fetch(url, {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  async deleteBet(id) {
    let url = `https://bet-royale-bd57d-default-rtdb.firebaseio.com/currentBets/${id}.json`;

    return await fetch(url, {
      method: "DELETE",
    });
  }

  async editBet(data, id) {
    let url = `https://bet-royale-bd57d-default-rtdb.firebaseio.com/currentBets/${id}.json`;

    return await fetch(url, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async getBetHistory() {
    let username = GetHash(localStorage.getItem("username"));

    try {
      let response = await fetch(
        `https://bet-royale-bd57d-default-rtdb.firebaseio.com/user/${username}/betHistory.json`
      );

      let responseJson = await response.json();

      return responseJson;
    } catch (error) {
      console.error(error);
    }
  }

  async logBet(data) {
    let username = GetHash(localStorage.getItem("username"));

    let url = `https://bet-royale-bd57d-default-rtdb.firebaseio.com/user/${username}/betHistory.json`;

    return await fetch(url, {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}

export default BetService;
