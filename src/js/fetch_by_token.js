export async function h_postJson_by_token(url = "", data = {}) {
    console.log(`h_post_by_token, access_token : `, localStorage.getItem("access_token"));
    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("access_token")}`
            },
            body: JSON.stringify(data),
        });

        if (response.ok) {
            const result = await response.json();
            console.log("h_post_by_token Success:", result);
            return result;
        } else {
            // HTTP 응답 코드가 200 또는 201이 아닌 경우
            console.log(
                "h_post_by_token Error: Unexpected response status",
                response.status
            );
            // 여기서 throw를 사용하여 원하는 방식으로 처리할 수 있습니다.
            throw new Error("Unexpected response status");
        }


    } catch (error) {
        console.log("post_by_token Error:", error);
        throw error;
    }
}


export async function h_get_by_token(url = "") {
    console.log(`h_get_by_token, access_token : `, localStorage.getItem("access_token"));
    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization":`Bearer ${localStorage.getItem("access_token")}`          
        }
      });
  
    //   const result = await response.json();
    //   console.log("h_get_by_token:", result);
    //   return result;

      if (response.ok) {
        const result = await response.json();
        console.log("h_get_by_token Success:", result);
        return result;
    } else {
        // HTTP 응답 코드가 200 또는 201이 아닌 경우
        console.log(
            "h_get_by_token Error: Unexpected response status",
            response.status
        );
        // 여기서 throw를 사용하여 원하는 방식으로 처리할 수 있습니다.
        throw new Error("Unexpected response status");
    }
      
    } catch (error) {
      console.error("h_get_by_token Error:", error);
    }
  }


  export async function h_postForm_by_token(url = "", formData) {
    console.log(`h_postForm_by_token, access_token : `, localStorage.getItem("access_token"));
    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("access_token")}`
            },
            body: formData,
        });

        if (response.ok) {
            const result = await response.json();
            console.log("h_postForm_by_token Success:", result);
            return result;
        } else {
            // HTTP 응답 코드가 200 또는 201이 아닌 경우
            console.log(
                "h_postForm_by_token Error: Unexpected response status",
                response.status
            );
            // 여기서 throw를 사용하여 원하는 방식으로 처리할 수 있습니다.
            throw new Error("Unexpected response status");
        }


    } catch (error) {
        console.log("h_postForm_by_token Error:", error);
        throw error;
    }
}