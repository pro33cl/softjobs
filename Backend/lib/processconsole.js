
class ProcessConsole {
    static processArray = [];

    static add(stringProcess){
        ProcessConsole.processArray.push(stringProcess);
    };

    static delete(){
        ProcessConsole.processArray = [];
    }

    static print(){
        return ProcessConsole.processArray.join("\n");
    }
};

export default ProcessConsole;