export default class HelperFunctions {
    idExtractor(text) {
        const messageArray = text.split(" ");
        const regexPattern = /@@@__(.*?)\^\^/;
        const regexPattern1 = /@@@__([\s\S]*?)\^\^/;
        const matches = [];
        messageArray.map((word) => {
            const match = word.match(regexPattern);
            if (match) {
                const match1 = regexPattern1.exec(word);
                if (match1 && match1.length > 1) {
                    matches.push(match1[1]);
                }
            }
        });
        return matches;
    }
    mentionedUserLinkGenerator(inputPostMessage) {
        let userPostMessage = "";
        let str = inputPostMessage;
        str = str.split("@@@__").join('<a href="/userprofile/');
        str = str.split("^^").join('">@');
        str = str.split("@@@").join("</a>");
        if (str !== "") {
            userPostMessage = str.trim();
        }
        return userPostMessage;
    }
    extractYouTubeURL(text) {
        const youtubeURLRegex = /(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/\S+/gi;
        const matches = text.match(youtubeURLRegex);
        return matches ? matches[0] : null;
    }
};