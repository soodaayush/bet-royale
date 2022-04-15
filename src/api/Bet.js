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
    let address = GetHash(localStorage.getItem("address"));

    try {
      let response = await fetch(
        `https://bet-royale-bd57d-default-rtdb.firebaseio.com/user/${address}/betHistory.json`
      );

      let responseJson = await response.json();

      return responseJson;
    } catch (error) {
      console.error(error);
    }
  }

  async logBet(data) {
    let address = GetHash(localStorage.getItem("address"));

    let url = `https://bet-royale-bd57d-default-rtdb.firebaseio.com/user/${address}/betHistory.json`;

    return await fetch(url, {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  async logBetInBetsHistory(data) {
    let url = `https://bet-royale-bd57d-default-rtdb.firebaseio.com/betsHistory.json`;

    return await fetch(url, {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  async getBetsHistory() {
    try {
      let response = await fetch(
        "https://bet-royale-bd57d-default-rtdb.firebaseio.com/betsHistory.json"
      );

      let responseJson = await response.json();

      return responseJson;
    } catch (error) {
      console.error(error);
    }
  }

  async changeUsername(data, inputedAddress) {
    let address = GetHash(inputedAddress);

    let url = `https://bet-royale-bd57d-default-rtdb.firebaseio.com/user/${address}/profile.json`;

    this.getUsername(address).then((addr) => {
      console.log(addr);

      const usernames = [];

      for (const key in addr) {
        const username = {
          id: key,
          ...addr[key],
        };

        usernames.push(username);
      }

      console.log(usernames[0]);

      if (usernames[0] !== undefined) {
        let newData = {
          username: data,
        };

        this.editUsername(address, newData);

        return;
      }
    });

    return await fetch(url, {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  async editUsername(address, data) {
    let url = `https://bet-royale-bd57d-default-rtdb.firebaseio.com/user/${address}/profile.json`;

    return await fetch(url, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async getUsername(address) {
    try {
      let response = await fetch(
        `https://bet-royale-bd57d-default-rtdb.firebaseio.com/user/${address}/profile.json`
      );

      let responseJson = await response.json();

      return responseJson;
    } catch (error) {
      console.error(error);
    }
  }
}

export default BetService;
