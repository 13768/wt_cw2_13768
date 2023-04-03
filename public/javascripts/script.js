function stars(e)
{
    var myvalue = null;
    let star = document.querySelectorAll('.fa-star');
    let rate_num = document.querySelector('#rate-num');
    
    for (let i = 0; i < star.length; i++)
    {
        star[i].classList.remove("fa-solid")
    }

    for (let j = 0; j <= e; j++) {
        star[j].classList.add("fa-solid");
        myvalue = j + 1;
    }
    rate_num.innerHTML = myvalue;
    document.querySelector('#hidden').value = myvalue
}
