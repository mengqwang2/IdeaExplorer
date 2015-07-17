import dataParse

def clean_word(word):
    PUNCTUATION = ['(', ')', ':', ';', ',', '-', '!', '.', '?', '/', '"', '*','#','_']
    word = word.lower()
    for punc in PUNCTUATION:
        word = word.replace(punc, ',')
    return word


def main():
    dp=dataParse.dataParse("../../data/ideas.txt")
    des1=dp.fieldParse("type_of_innovation")
    des2=dp.fieldParse("tags")


    f1 = open("../../data/other/type.txt","w+")
    for ele in des1:
        f1.write(unicode(ele).encode('utf-8')+',')
    f1.close()


    f2 = open("../../data/other/tag.txt","w+")
    j = 0
    for ele in des2:
        if ele == '':
            ele = 'na'

        word = unicode(ele).encode('utf-8')
        word = clean_word(word)
        f2.write(word + ',')

        f = open("../../data/document/tag"+str(j)+".txt","w")
        f.write(word)
        j = j+1

    f.close()
    f2.close()


if __name__ == '__main__':
    main()
