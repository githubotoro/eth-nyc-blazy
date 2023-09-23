// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract Blazy {
    address public owner;

    enum Vote {
        NON,
        GAS,
        HMM
    }
    uint256 public total_ideas;

    struct Iteration {
        string title;
        string one_liner;
    }

    struct Idea {
        address owner;
        uint256 total_iterations;
        Iteration[] iterations;
        mapping(address => Vote) votes;
        address[] voters;
        uint256 gases;
        uint256 hmms;
        uint256 total_votes;
    }

    struct IdeaResponse {
        address owner;
        uint256 total_iterations;
        uint256 gases;
        uint256 hmms;
        uint256 total_votes;
    }

    mapping(uint256 => Idea) public ideas;
    mapping(address => uint256[]) public ideaList;
    mapping(address => uint256) totalUserIdeas;

    function changeOwner(address _owner) public {
        require(msg.sender == owner, 'Only owner can update owner.');
        owner = _owner;
    }

    function getIterations(uint256 id) public view returns (Iteration[] memory) {
        Idea storage idea = ideas[id];

        return idea.iterations;
    }

    function getVoters(uint256 id) public view returns (address[] memory) {
        Idea storage idea = ideas[id];

        return idea.voters;
    }

    function getVote(uint256 id, address voter) public view returns (Vote) {
        Idea storage idea = ideas[id];

        return idea.votes[voter];
    }

    function getIdea(uint256 id) public view returns (IdeaResponse memory) {
        IdeaResponse memory ideaResponse = IdeaResponse(
            ideas[id].owner,
            ideas[id].total_iterations,
            ideas[id].gases,
            ideas[id].hmms,
            ideas[id].total_votes
        );

        return ideaResponse;
    }

    function getIdeaList(address userAddress) public view returns (uint256[] memory) {
        return ideaList[userAddress];
    }

    function doVote(uint256 id, Vote vote, address userAddress) public {
        require(vote != Vote.NON, 'You cannot vote NON.');

        Idea storage idea = ideas[id];

        require(idea.total_iterations != 0, "Idea doesn't exist yet.");

        if (idea.votes[userAddress] == Vote.NON) {
            // new vote
            if (vote == Vote.GAS) {
                idea.gases += 1;
            } else {
                idea.hmms += 1;
            }

            idea.voters.push(userAddress);
            idea.total_votes += 1;
        } else {
            // update vote
            require(idea.votes[userAddress] != vote, 'You have already voted this.');

            if (vote == Vote.GAS) {
                idea.hmms -= 1;
                idea.gases += 1;
            } else {
                idea.gases -= 1;
                idea.hmms += 1;
            }
        }

        idea.votes[userAddress] = vote;
    }

    function makeIteration(
        uint256 id,
        string memory title,
        string memory one_liner,
        uint256 isNew,
        address userAddress
    ) public {
        if (isNew == 1) {
            // add idea
            uint256 new_id = total_ideas;
            Idea storage idea = ideas[new_id];

            idea.owner = userAddress;
            idea.total_iterations += 1;
            idea.iterations.push(Iteration(title, one_liner));

            ideaList[userAddress].push(new_id);
            totalUserIdeas[userAddress] += 1;

            total_ideas += 1;
        } else {
            // update idea
            Idea storage idea = ideas[id];
            require(userAddress == idea.owner, 'Only idea owner can make an iteration.');

            idea.total_iterations += 1;
            idea.iterations.push(Iteration(title, one_liner));
        }
    }
}
