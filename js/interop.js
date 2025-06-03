window.blazorHelpers = {
    setDocumentTitle: (title) => document.title = title,

    initLoader: () => {
        const loader = document.createElement('div');
        loader.id = 'blazor-loader';
        loader.className = 'progress-bar';
        loader.innerHTML = '<div class="progress"></div>';
        document.body.prepend(loader);
    }
};