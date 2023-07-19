## Getting possible rewards from IP


### Approach 1
1. Get all the currently active rewards from IP (it requires absolutely no check) - getPossibleRewardFromIP()
2. On the DW part, it needs to dry run everything and filter out the rewards it can never receive. - getPossibleReward()


### Approach 2
1. Send the possible set of insight and ad keys to the IP. IP does all the filtering for us. - getPossibleRewardFromIP()
