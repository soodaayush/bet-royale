import { motion } from "framer-motion";

const Guide = () => {
  return (
    <motion.div
      initial={{ opacity: 0, filter: "blur(2px)" }}
      transition={{ ease: "easeInOut" }}
      animate={{ opacity: 1, filter: "blur(0)" }}
      exit={{ opacity: 0, filter: "blur(2px)" }}
    >
      <div className="container d-flex flex-column align-items-center text-left pt-4 pb-4">
        <div>
          <h1>A Guide To Using Bet Royale</h1>
          <p className="pt-3">
            <strong>Note: This project is still in beta.</strong>
          </p>
          <h2 className="pt-3">
            What Do You Need To Do Everything On This Website?
          </h2>
          <p className="pt-3">
            You need a Metamask wallet and a Discord account, that's all you
            need. You need both your Metamask wallet and Discord account in
            order to bet. In order to create bets, you just need your Discord
            account.
          </p>
          <h2 className="pt-3">The Home Page</h2>
          <p className="pt-3">
            The Home Page is where you can see the current bets.
          </p>
          <h2 className="pt-3">The Create Bet Page</h2>
          <p className="pt-3">
            The Create Bet page is where you create bets. You have to set
            parameters such as: Name, Description Deadline, Results, etc.
            Remember, when setting a deadline and result, you are setting them
            in UTC time, so be aware of everyone's timezones when setting the
            deadline and results parameters.
          </p>
          <h2 className="pt-3">The Betting History Page</h2>
          <p className="pt-3">
            The Betting History Page is where you can see the history of all of
            the bets that have been made on the website.
          </p>
          <h2 className="pt-3">The My Betting History Page</h2>
          <p className="pt-3">
            The Betting History Page is where you can see your history of bets
            you have betted on.
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default Guide;
